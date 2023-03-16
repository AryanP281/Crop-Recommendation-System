from keras.models import load_model
import os
from django.conf import settings
import numpy as np
from keras.utils import load_img, img_to_array
import requests
import pandas as pd
import pickle
from .models import *

soilModel = load_model(os.path.join(settings.ML_MODELS, 'SoilModel.h5'))
recommendationModel = pickle.load(open(os.path.join(settings.ML_MODELS, "RecommendationModel.sav"), 'rb'))

class RecommendationPipeline :

    def __init__(self,user) :
        self.soilPredictionModel = soilModel
        self.soilMap = ["Alluvial", "Black", "Laterite", "Peat", "Sandy Loam", "Yellow"]
        self.cropMap = {0: 'apple', 1: 'banana', 2: 'blackgram', 3: 'chickpea', 4: 'coconut', 5: 'coffee', 6: 'cotton', 7: 'grapes', 8: 'jute', 9: 'kidneybeans', 10: 'lentil', 11: 'maize', 12: 'mango', 13: 'mothbeans', 14: 'mungbean', 15: 'muskmelon', 16: 'orange', 17: 'papaya', 18: 'pigeonpeas', 19: 'pomegranate', 20: 'rice', 21: 'watermelon'}
        self.user = user

    def getRecommendationsByImage(self,soilImgPath, coords, n) :
        soilType = self.getSoilType(soilImgPath)
        soilData = self.getSoilProperties(soilType)
        weatherData = self.getWeatherDetails(coords)

        initialRecommendations = self.getInitialRecommendations(soilData, weatherData,n) #[1,3, 5]
        print(initialRecommendations)

        hs = self.getHistoryScores(initialRecommendations) #{1: 0.5, 3: 0.2}
        print(hs)
        #ps = self.getPriceScore(initialRecommendations) #{1: }

    def getRecommendationsByValues(self, soilProp, coords, n) :
        soilData = pd.DataFrame([[soilProp['N'],soilProp['P'],soilProp['K'],soilProp['Ph']]],columns=["N","P","K","ph",])
        weatherData = self.getWeatherDetails(coords)

        initialRecommendations = self.getInitialRecommendations(soilData, weatherData,n)
        print(initialRecommendations)

            
    def getSoilType(self,soilImgPath) :
        img = img_to_array(load_img(os.path.join(settings.MEDIA_ROOT, soilImgPath), target_size=(256,256)))
        img /= 255
        img = np.expand_dims(img, axis=0)
        
        prediction = self.soilPredictionModel.predict([img])
        return np.argmax(prediction)

    def getSoilProperties(self, soilType) :
        
        soilDf = pd.read_csv(os.path.join(settings.DATASETS, "soil_features.csv"))
        soilData = soilDf.loc[soilDf['Type'] == self.soilMap[soilType]]

        return soilData      
    
    def getWeatherDetails(self, coords) :

        weatherRequest = requests.get(f"https://api.openweathermap.org/data/2.5/weather?lat={coords[0]}&lon={coords[1]}&appid={settings.WEATHER_API_KEY}")
        if weatherRequest.status_code == 200 :
            weatherData = weatherRequest.json()
            return {"temp": weatherData['main']['temp'],"humidity": weatherData['main']['humidity'], "rainfall": random.choice([3005,901,882,1034])}
        else :
            raise RuntimeError(f"Failed to fetch weather. {weatherRequest.status_code}")

    def getInitialRecommendations(self, soilData, weatherData,n) :

        x = pd.DataFrame([[soilData.loc[soilData.index]['N'], soilData.loc[soilData.index]['P'], soilData.loc[soilData.index]['K'], weatherData["temp"],weatherData["humidity"], soilData.loc[soilData.index]['ph'],  weatherData["rainfall"]]], columns=["N","P","K","temperature","humidity","ph","rainfall"])

        probs = recommendationModel.predict_proba(x)
        sortedProbs = np.argsort(probs)
        
        initialRecommendations = []
        for i in range(1,n+1) :
            initialRecommendations.append(sortedProbs[0][len(sortedProbs)-i])
        
        return initialRecommendations
    
    def getHistoryScores(self, initialRecommendations) :
        
        cropDf = pd.read_csv(os.path.join(settings.DATASETS, "Crop Data New.csv"))

        farmerHistory = FarmerHistory.objects.select_related().filter(farmer=self.user)
        historyScores = {}
        for recomm in initialRecommendations :
            recommDetails = cropDf.iloc[recomm]
            historyScores[recomm] = [-1,0,0.0]
            for history in farmerHistory :
                sim = self.calculateCropSimilarity(recommDetails, cropDf.iloc[int(history.crop)])
                if(sim > historyScores[recomm][1]) :
                    historyScores[recomm][0] = history.crop
                    historyScores[recomm][1] = sim
                    historyScores[recomm][2] = history.actual / history.expected
                elif(sim == historyScores[recomm][1] and (history.actual / history.expected) > historyScores[recomm][2]) :
                    historyScores[recomm][0] = history.crop
                    historyScores[recomm][2] = history.actual / history.expected
        
        return historyScores

    def calculateCropSimilarity(self,crop1,crop2) :
        tempSim = self.jaccardSimilarity([crop1['Temp(min)'],crop1['Temp(max)']], [crop2['Temp(min)'],crop2['Temp(max)']])
        rainfallSim = self.jaccardSimilarity([crop1['Rainfall(min)'],crop1['Rainfall(max)']], [crop2['Rainfall(min)'],crop2['Rainfall(max)']])
        phSim = self.jaccardSimilarity([crop1['Ph(min)'],crop1['Ph(max)']], [crop2['Ph(min)'],crop2['Ph(max)']], 0.1)
        
        c1 = []
        c2 = []
        for soil in self.soilMap :
            c1.append(crop1[soil])
            c2.append(crop2[soil])
        soilSim = self.binarySimilarity(c1,c2)

        return (tempSim + rainfallSim + phSim + soilSim) / 4.0
    
    def jaccardSimilarity(self, i1, i2, step=1) :
        ints = max(((min(i1[1],i2[1]) - max(i1[0],i2[0]))/step)+1, 0)
        union = ((max(i1[1],i2[1]) - min(i1[0], i2[0]))/step)+1

        return ints / union

    def binarySimilarity(self, c1, c2) :

        dissm = 0
        for i in range(len(c1)) :
            if(c1[i] != c2[i]) :
                dissm += 1
        
        return (1.0 - (dissm / len(c1))) 
            


        

"""
img = np.frombuffer(soilPic)
        print(img)

        print(self.soilPredictionModel.predict([soilPic]))
"""