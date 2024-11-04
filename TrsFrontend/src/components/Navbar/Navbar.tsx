/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import zocopng from "../../assets/image/zocopng.png";
import { useNavigate } from "react-router-dom";
import avatarImg from "../../assets/image/avatardefault_92824.png";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
import { UserContext, UserContextType } from "../../Context/UserProvider";

const Navbartab = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { user, setUser }: UserContextType = useContext(UserContext);

  const handleLogout = (navigate: any) => {
    localStorage.removeItem("token");
    localStorage.removeItem("jobInfos");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <img
              src={zocopng}
              className="w-[100px] cursor-pointer"
              onClick={() => navigate("/")}
              alt="Logo"
            />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link color="foreground" aria-current="page" to="/">
              Home
            </Link>
          </NavbarItem>

          {/* Conditionally show "My Calculations" for all users */}
          {user && (
            <NavbarItem>
              <Link color="foreground" aria-current="page" to="/my-calculations">
                My Calculations
              </Link>
            </NavbarItem>
          )}

          {/* Conditionally show "Admin" page only if user is admin */}
          {user?.role === "admin" && (
            <NavbarItem>
              <Link color="foreground" aria-current="page" to="/admin">
                Admin
              </Link>
           
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarContent justify="end">
          {!user ? (
            <>
              <NavbarItem className="lg:flex">
                <Link to="/login">Login</Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="warning" to="/register" variant="flat">
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem className="lg:flex">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                <img
  src={avatarImg}
  alt="user"
  className="transition-transform shadow-xl w-10 h-10 rounded-full cursor-pointer"
/>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={() => handleLogout(navigate)}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          )}
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu>
          <NavbarMenuItem>
            <span
              className="text-[#2D3035] font-[500] cursor-pointer text-center w-[130px] hover:text-[#C5CF2F]"
              onClick={() => navigate("/my-calculations")}
            >
              My Calculations
            </span>
          </NavbarMenuItem>
          {user?.role === "admin" && (
            <NavbarMenuItem>
              <span
                className="text-[#2D3035] font-[500] cursor-pointer text-center w-[130px] hover:text-[#C5CF2F]"
                onClick={() => navigate("/admin")}
              >
                Admin Dashboard
              </span>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default Navbartab;
