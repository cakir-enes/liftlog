import { Component } from "solid-js";

export const Dumbell: Component<{ classes: string }> = ({ classes }) => (
  <svg
    class={classes}
    stroke-width="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#000000"
  >
    <path
      d="M7.4 7H4.6a.6.6 0 00-.6.6v8.8a.6.6 0 00.6.6h2.8a.6.6 0 00.6-.6V7.6a.6.6 0 00-.6-.6zM19.4 7h-2.8a.6.6 0 00-.6.6v8.8a.6.6 0 00.6.6h2.8a.6.6 0 00.6-.6V7.6a.6.6 0 00-.6-.6z"
      stroke="#000000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M1 14.4V9.6a.6.6 0 01.6-.6h1.8a.6.6 0 01.6.6v4.8a.6.6 0 01-.6.6H1.6a.6.6 0 01-.6-.6zM23 14.4V9.6a.6.6 0 00-.6-.6h-1.8a.6.6 0 00-.6.6v4.8a.6.6 0 00.6.6h1.8a.6.6 0 00.6-.6zM8 12h8"
      stroke="#000000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
);

export const Sprint: Component<{ classes: string }> = ({ classes }) => (
  <svg
    class={classes}
    stroke-width="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#000000"
  >
    <path
      d="M15 7a2 2 0 100-4 2 2 0 000 4zM12.613 8.267l-3.308 4.135 4.135 4.135-2.067 4.55"
      stroke="#000000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M6.41 9.508l3.387-3.309 2.816 2.068 2.895 3.308h3.722M8.892 15.71l-1.241.827H4.343"
      stroke="#000000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
);
