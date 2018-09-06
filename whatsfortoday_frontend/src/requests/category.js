import {BASE_URL} from "./config";

const Category = {
    all() {
      return fetch(`${BASE_URL}/categories`, {
        method: "GET",
        credentials: "include"
      }).then(res => res.json());
    }
};

export default Category;