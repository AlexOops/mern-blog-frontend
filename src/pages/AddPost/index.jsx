import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth); // авторизован или не авторизован
  const inputFileRef = useRef(null);

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // const [isLoading, setLoading] = useState("");

  const isEditing = Boolean(id);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];

      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (e) {
      console.warn(e);
      alert("failed to upload file");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      // setLoading(true);

      const fields = {
        text,
        title,
        tags,
        imageUrl
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields) // передали пост в редактирование
        : await axios.post("/posts", fields); // передали пост в сохранение

      // достаем id, чтобы перевести пользователя на стать, которая в адресноу строке
      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`); // перевели на стать, если создана

    } catch (e) {
      console.warn(e);
      alert("failed to create post");
    }
  };

  //РЕДАКТИРОВАНИЕ
  useEffect(() => {
    // если id, тогда в форму закидываем данные роста
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setTags(data.tags);
        setImageUrl(data.imageUrl);
      }).catch((err) => {
        console.warn(err);
        alert("failed to get post");
      });
    }
  }, [id]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000
      }
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} // скрытый input
             type="file"
             onChange={handleChangeFile}
             hidden
      />
      {imageUrl && (
        <>  <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        value={tags}
        onChange={(e) => {
          setTags(e.target.value);
        }}
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
