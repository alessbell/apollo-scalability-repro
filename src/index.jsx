/*** APP ***/
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
  useFragment,
} from "@apollo/client";

import { link } from "./link.js";
import "./index.css";

const PersonFragment = gql`
  fragment PersonFields on Person {
    name
  }
`;

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      ...PersonFields @nonreactive
    }
  }
  ${PersonFragment}
`;

function Title({ id }) {
  // const people = usePeople();
  const { data } = useFragment({
    fragment: PersonFragment,
    from: {
      __typename: "Person",
      id,
    },
  });
  return <h1>{data?.name}</h1>;
}

function AddToCart({ id }) {
  // const people = usePeople();
  const { data } = useFragment({
    fragment: PersonFragment,
    from: {
      __typename: "Person",
      id,
    },
  });
  return <button>{data?.name}</button>;
}

function Hidden() {
  return null;
}

function ItemCard({ id }) {
  return (
    <div>
      <Title id={id} />
      {Array.from({ length: 30 }).map(() => (
        <Hidden />
      ))}
      <AddToCart id={id} />
    </div>
  );
}

function Row({ people }) {
  // const people = usePeople();
  return (
    <div style={{ display: "flex" }}>
      {people.map(({ id }) => (
        <>
          <ItemCard id={id} />
          <ItemCard id={id} />
          <ItemCard id={id} />
          <ItemCard id={id} />
          <ItemCard id={id} />
        </>
      ))}
    </div>
  );
}

function Grid({ people }) {
  // const people = usePeople();
  if (!people) return <div>Loading...</div>;
  return people.map(({ id }) => (
    <>
      <Row people={people} />
      <Row people={people} />
      <Row people={people} />
    </>
  ));
}

function App() {
  const { data, refetch } = useQuery(ALL_PEOPLE);
  const [show, setShow] = useState(false);

  const flip = () => {
    refetch();
    setShow(!show);
  };

  return (
    <div>
      <button onClick={flip}>Click Me</button>
      {show && <Grid people={data?.people} />}
    </div>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
