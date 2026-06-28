import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="py-1" style={{ backgroundColor: "rgb(30, 30, 45)" }}>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h1 className="text-white">Welcome to Job Portal!</h1>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
