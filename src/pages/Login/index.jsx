import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fetchAuth } from "../../redux/slices/auth";

export const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      email: "test1@test.ru",
      password: "12345"
    },
    mode: "onChange" // валидация, если поля поменялись
  });

  const dispatch = useDispatch();

  const onSubmit = (values) => {
    dispatch(fetchAuth(values))
  };

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
          error={errors.email?.message}
          // Если email нет в списке ошибок, сообщение не нужно
          helperText={errors.email?.message}
          {...register("email", { required: "specify the email address" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          error={errors.password?.message}
          helperText={errors.password?.message}
          {...register("password", { required: "specify the password" })}
          fullWidth />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
