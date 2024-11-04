import React, { useContext } from "react";
// import { Or } from "../../components/Or";
import { AuthBody } from "../../components/AuthBody";
import { AuthForm } from "../../components/AuthInputForm";
import { AuthFooter } from "../../components/AuthFooter";
import { AuthHeader } from "../../components/AuthHeader";
import { AuthSubmit } from "../../components/AuthSubmit";
//import { ContinueWithGoogle } from "../../components/ContinueWithGoogle";
//import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

import "./auth.scss";

const Register = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [data, setData] = React.useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = React.useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const authContext = useContext(AuthContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });

    handleValidation(name, value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    handleValidation(name, value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValidation = (name: any, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email.";
        } else {
          newErrors.email = "";
        }
        break;
      case "username":
        if (!validateUsername(value)) {
          newErrors.username =
            "The username can only contain letters, numbers and underscores (_).";
        } else {
          newErrors.username = "";
        }
        break;
      case "password":
        // eslint-disable-next-line no-case-declarations
        const passwordError = validatePassword(value);
        if (passwordError) {
          newErrors.password = passwordError;
        } else {
          newErrors.password = "";
        }
        break;
      case "repeatPassword":
        if (value !== data.password) {
          newErrors.repeatPassword =
            "Passwords do not match. Please verify and try again.";
        } else {
          newErrors.repeatPassword = "";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleRegister = async () => {
    let valid = true;
    const newErrors = {
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
    };

    if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email.";
      valid = false;
    }

    if (!validateUsername(data.username)) {
      newErrors.username =
        "The username can only contain letters, numbers and underscores (_).";
      valid = false;
    }

    const passwordError = validatePassword(data.password);
    if (passwordError) {
      newErrors.password = passwordError;
      valid = false;
    }

    if (data.password !== data.repeatPassword) {
      newErrors.repeatPassword =
        "Passwords do not match. Please verify and try again.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    try {
      if (authContext) {
        await authContext.register(data);
        window.location.reload();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error);
      toast.error(String(error.response.data.message));
    }
  };

  const validateUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (username.length < 3 || username.length > 20) {
      return false;
    }
    if (!regex.test(username)) {
      return false;
    }
    return true;
  };

  const validatePassword = (password: string) => {
    // Verificar longitud de la contraseña
    if (password.length < 8) {
      return "The password must be at least 8 characters.";
    }
    if (password.length > 20) {
      return "The password cannot be more than 20 characters.";
    }

    // Verificar patrón de caracteres
    const regex =
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_])[A-Za-z\d\W\_]{8,}$/;
    if (!regex.test(password)) {
      return "The password must include a capital letter, a number, and a special character.";
    }

    return "";
  };

  const validateEmail = (email: string) => {
    // Expresión regular para validar el formato de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const inputs = [
    {
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "Enter your username",
      onBlur: handleBlur,
      onChange: handleChange,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      onBlur: handleBlur,
      onChange: handleChange,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      onBlur: handleBlur,
      onChange: handleChange,
    },
    {
      label: "Repeat password",
      name: "repeatPassword",
      type: "password",
      placeholder: "Repeat your password",
      onBlur: handleBlur,
      onChange: handleChange,
    },
  ];

  return (
    <AuthBody>
      <AuthHeader title="Register" description="Register a new account" />
      {/* <ContinueWithGoogle /> */}
      {/* <Or /> */}
      <AuthForm inputs={inputs} handleChange={handleChange} errors={errors} />
      <AuthSubmit label="Register" onClick={() => handleRegister()} />
      <AuthFooter
        href="/login"
        label="You registered yet?"
        hrefLabel="Click here"
      />
    </AuthBody>
  );
};

export default Register;
