import {BASE_URL} from "./config";

const Session = {
    create(params) {
      return fetch(`${BASE_URL}/users/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      }).then(res => {return res});
    },

    destroy() {
      return fetch(`${BASE_URL}/users/signout`, {
        method: "GET",
        credentials: "include"
      }).then(res => res.json());
    }
};

export default Session;