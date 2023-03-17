import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import CropCard from "../components/CropCard";
import Header from "../components/Header";
import Loading from "../components/Loading";

const RecommendationScreen = ({ route }) => {
  // const [data, setData] = useState([
  //   {
  //     name: "Potato",
  //     img: "https://cdn.mos.cms.futurecdn.net/iC7HBvohbJqExqvbKcV3pP.jpg",
  //     description:
  //       "The potato is a starchy food, a tuber of the plant Solanum tuberosum and is a root vegetable native to the Americas. The plant is a perennial in the nightshade family Solanaceae. Wild potato species can be found from the southern United States to southern Chile.",
  //     score: 70,
  //   },
  //   {
  //     name: "Rice",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEwIZIOIATbB3tekapCvZXmoI_AMqMyeZezg&usqp=CAU",
  //     description:
  //       "Rice is the seed of the grass species Oryza sativa or less commonly Oryza glaberrima. The name wild rice is usually used for species of the genera Zizania and Porteresia, both wild and domesticated, although the term may also be used for primitive or uncultivated varieties of Oryza.",
  //     score: 65,
  //   },
  //   {
  //     name: "Corn",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ID4zTc-e8okvCjidCNrUz-hmU3amAqRBGg&usqp=CAU",
  //     description:
  //       "Maize, also known as corn (North American and Australian English), is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago. The leafy stalk of the plant produces pollen inflorescences and separate ovuliferous inflorescences called ears that when fertilized yield kernels or seeds, which are fruits",
  //     score: 50,
  //   },
  //   {
  //     name: "Barley",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDw5kh2VgITrBnojCIyP2K4JDSzSlT_x1mQw&usqp=CAU",
  //     description:
  //       "Barley, a member of the grass family, is a major cereal grain grown in temperate climates globally. It was one of the first cultivated grains, particularly in Eurasia as early as 10,000 years ago.",
  //     score: 42,
  //   },
  // ]);
  const { data } = route.params;
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     getRecommendations(setData);
  //     setTimeout(() => setLoading(false), 3000);
  //   }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <FlatList
      style={styles.container}
      data={data}
      ListHeaderComponent={() => <Header title={"Your Recommendations"} />}
      renderItem={({ item }) => (
        <CropCard
          name={item.name}
          img={item.img}
          description={item.description}
          score={item.score}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RecommendationScreen;
