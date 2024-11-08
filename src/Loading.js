import { SyncLoader } from "react-spinners";

const override = {
  margin: "0 auto",
  marginTop: "300px",
  textAlign: "center",
  size: "20",
};

function Loading(loading) {
  return (
    <div>
      <SyncLoader
        color="#ff9500"
        cssOverride={override}
        loading={loading}
        margin={5}
        size={20}
      />
    </div>
  );
}

export default Loading;
