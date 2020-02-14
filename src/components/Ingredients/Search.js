import React, { useState, useEffect, useRef } from "react";
import Card from "../UI/Card";
import "./Search.css";

//react memo doesn't update the component until the props change.
const Search = React.memo(props => {
  //taking out onLoadIngredients from the props that are recieved by this componenet using object destructuring.
  const { onLoadIngredients } = props;

  const [enteredFilter, setEnteredFilter] = useState("");
  //using ref to hold the value coming from the user input, which is mutable.
  const inputRef = useRef();

  useEffect(() => {
    //setting up a timer so the network request is only sent when we pass 500ms mark.
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://react-hooks-5ffa7.firebaseio.com/ingredients.json" + query
        )
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
