import axios from "axios";
import useSWR from "swr";
export default function Dashboard() {
  const fetcher = (...args) => axios(...args).then((res) => res.data);

  const { data, error } = useSWR("http://localhost:5000/test", fetcher);
  if (error)
    return (
      <div>
        <p>failed to load</p>
      </div>
    );
  if (!data)
    return (
      <div>
        <p>wait ...</p>
      </div>
    );
  return <div>{data} </div>;
}
