import Navbar from "../Components/Navbar";

function Help() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-screen-lg px-4">
        <div className="my-4 text-3xl">Help</div>
        <div className="my-4 text-lg">
          <p>Welcome to the F1 Dash Help Page!</p>
          <p>
            If you have any questions or need assistance, please refer to the
            following sections:
          </p>
          <ul className="list-disc pl-5">
            <li>How to use the dashboard</li>
            <li>Troubleshooting common issues</li>
          </ul>
          <p>If you need further assistance, you can message me directly.</p>
        </div>
      </div>
    </>
  );
}

export default Help;
