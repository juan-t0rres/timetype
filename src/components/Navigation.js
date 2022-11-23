import {
  Navbar,
  NavbarBrand,
} from "shards-react";

export default function Navigation() {

  return (
    <Navbar expand="md" type="dark" className="navbar">
      <NavbarBrand href="/">
        timetype<span className="correct">.io</span>
      </NavbarBrand>
    </Navbar>
  );
}
