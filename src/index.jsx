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
  const { data } = useFragment({
    fragment: PersonFragment,
    from: {
      __typename: "Person",
      id,
    },
  });
  return <button>{data?.name}</button>;
}

function Hidden({ id }) {
  const { data } = useFragment({
    fragment: PersonFragment,
    from: {
      __typename: "Person",
      id,
    },
  });
  return null;
}

function ItemCard({ id }) {
  const { data } = useFragment({
    fragment: PersonFragment,
    from: {
      __typename: "Person",
      id,
    },
  });

  return (
    <div>
      <Title id={id} />
      {Array.from({ length: 30 }).map(() => (
        <Hidden id={id} />
      ))}
      <AddToCart id={id} />
    </div>
  );
}

function Row() {
  const { data } = useQuery(ALL_PEOPLE);

  return (
    <div style={{ display: "flex" }}>
      {data?.people.map(({ id }) => (
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
  if (!people) return <div>Loading...</div>;
  return people.map(({ id }) => (
    <>
      <Row />
      <Row />
      <Row />
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
