import { DataTable, Searchbar } from "react-native-paper";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useState, useEffect, useContext, useMemo, use } from "react";
import { UserContext } from "../Contexts/userContext";
import colors from "../config/colors";
import Icon from "react-native-vector-icons/MaterialIcons";

import dayjs from "dayjs";

function Table() {
  const limit = 5;
  const { data, setData } = useContext(UserContext);
  const memoizedData = useMemo(() => data, [data]);
  const memoizedSetData = useMemo(() => setData, [setData]);
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(memoizedData);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToDisplay, setEntriesToDisplay] = useState(
    memoizedData?.slice(0, limit)
  );
  const [orderByDate, setOrderByDate] = useState(entriesToDisplay);
  useEffect(() => {
    setQuery("");
    const sortedData = memoizedData?.sort((a, b) => {
      return new Date(b.requested_at) - new Date(a.requested_at); // Sort by date
    });
    setFilteredData(sortedData);
    setEntriesToDisplay(sortedData?.slice(0, limit));
  }, [memoizedData]);
  function handleSearch(query) {
    setQuery(query);
    const filteredData = memoizedData?.filter((item) =>
      item.asset_name?.toLowerCase().includes(query.toLowerCase())
    );
    const sortedData = filteredData.sort((a, b) => {
      return new Date(b.requested_at) - new Date(a.requested_at);
    });
    setFilteredData(sortedData);
    setEntriesToDisplay(sortedData.slice(0, limit));
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(filteredData.length / limit)) {
      return;
    }
    setCurrentPage(page);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setEntriesToDisplay(filteredData.slice(startIndex, endIndex));
    
  };

  return (
    <View>
      <Searchbar
        placeholder="Search"
        inputStyle={{ fontSize: 14, alignSelf: "center" }}
        iconColor={colors.orange}
        icon={() => <Icon name="search" color={colors.orange} size={20} />}
        iconSize={0}
        style={Styles.search}
        value={query}
        cancelButton={null}
        onChangeText={(query) => handleSearch(query)}
      />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title
            style={{
              maxWidth: "40%",
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{ color: colors.blue, fontSize: 13, fontWeight: "bold" }}
              >
                Date Scanned
              </Text>
              <Icon name="swap-vert" size={15} color={colors.blue} />
            </View>
          </DataTable.Title>
          <DataTable.Title
            style={{
              maxWidth: "40%",
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{ color: colors.blue, fontSize: 13, fontWeight: "bold" }}
              >
                Asset Name
              </Text>
              <Icon name="swap-vert" size={15} color={colors.blue} />
            </View>
          </DataTable.Title>
          <DataTable.Title
            style={{
              maxWidth: "20%",
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
              <Text
                style={{ color: colors.blue, fontSize: 13, fontWeight: "bold" }}
              >
                Status
              </Text>
            </View>
          </DataTable.Title>
        </DataTable.Header>
        {entriesToDisplay &&
          entriesToDisplay
            .sort((a, b) => {
              return new Date(b.requested_at) - new Date(a.requested_at);
            })
            .map((item, index) => (
              <DataTable.Row
                style={{ height: 30, justifyContent: "center" }}
                key={index}
              >
                <DataTable.Cell style={{ maxWidth: "40%" }}>
                  {dayjs(item.requested_at).format("YYYY-MM-DD HH:mm:ss")}
                </DataTable.Cell>
                <DataTable.Cell style={{ maxWidth: "40%" }}>
                  {item.asset_name}
                </DataTable.Cell>
                <DataTable.Cell style={{ maxWidth: "20%" }}>
                  <View
                    style={{
                      backgroundColor: item.status === "pending" 
  ? colors.orange 
  : item.status === "approved" 
  ? colors.blue 
  : item.status === "rejected" 
  ? "red"
  : colors.default,
                      height: "55%",
                      width: "90%",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0.8,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontWeight: "900",
                        fontSize: 12,
                        textAlign: "center",
                        paddingVertical: 5,
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-start",
            marginLeft: 15,
            marginTop: 10,
            gap: 10,
          }}
        >
          <Text>
            Page {currentPage} of {Math.ceil(data?.length / limit)}
          </Text>
          <Icon
            name="keyboard-arrow-left"
            size={18}
            onPress={() => handlePageChange(currentPage - 1)}
          />
          <Icon
            name="keyboard-arrow-right"
            size={18}
            onPress={() => handlePageChange(currentPage + 1)}
          />
        </View>
      </DataTable>
    </View>
  );
}
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const Styles = StyleSheet.create({
  search: {
    width: "60%",
    height: height * 0.045,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkerShadeOfWhite,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 10,
    elevation: 5,
  },
});

export default Table;
