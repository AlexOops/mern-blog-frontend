import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Login.module.scss";

import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {

  const isAuth = useSelector(selectIsAuth); // авторизован или не авторизован
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      email: "test1@test.ru",
      password: "12345"
    },
    mode: "onChange" // валидация, если поля поменялись
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert("failed to login");
    }

    if ("token" in data.payload) { // будем хранить локально токен
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      {/*Выполнится только в том случае, если корректо введены поля*/}
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          type="email"
          label="E-Mail"
          //boolean
          error={Boolean(errors.email?.message)}
          // Если email нет в списке ошибок, сообщение не нужно
          helperText={errors.email?.message}
          {...register("email", { required: "specify the email address" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "specify the password" })}
          fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
