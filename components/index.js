import Nav from "./Nav.js";
import NewsList from "./NewsList.js";
import { observable } from "./observer.js";

export const store = {
  state: observable({
    category: "all",
  }),

  setState(newState) {
    for (const [key, value] of Object.entries(newState)) {
      if (!this.state[key]) continue;
      this.state[key] = value;
    }
  },
};

export { Nav, NewsList };
