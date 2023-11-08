import { useState, useEffect } from "react";
import * as Yup from "yup";
import "./App.css";

function App() {
    const [formData, setFormData] = useState({
        email: "",
        password1: "",
        password2: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password1: "",
        password2: "",
    });

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Неправильный email. Пожалуйста, попробуйте снова.")
            .required("(Обязательное поле)"),
        password1: Yup.string()
            .min(8, "Пароль должен быть длиннее 8 символов")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Пароль должен содержать хотя бы 1 строчную, 1 заглавную букву и 1 цифру"
            )
            .required("(Обязательное поле)"),
        password2: Yup.string()
            .oneOf([Yup.ref("password1")], "Пароли не совпадают")
            .required("(Обязательное поле)"),
    });

    useEffect(() => {
        validationSchema
            .validate(formData, { abortEarly: false })
            .then(() => {
                setFormErrors({});
            })
            .catch((err) => {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setFormErrors(newErrors);
            });
    }, [formData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = (event) => {
        event.preventDefault();

        validationSchema
            .validate(formData, { abortEarly: false })
            .then(() => {
                setFormErrors({});
                console.log(formData);
            })
            .catch((err) => {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setFormErrors(newErrors);
            });
    };

    return (
        <div className="App">
            <form onSubmit={onSubmit}>
                <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                {formErrors.email && (
                    <div className="errorText">{formErrors.email}</div>
                )}
                <input
                    required
                    name="password1"
                    type="password"
                    placeholder="Password"
                    value={formData.password1}
                    onChange={handleInputChange}
                />
                {formErrors.password1 && (
                    <div className="errorText">{formErrors.password1}</div>
                )}
                <input
                    required
                    name="password2"
                    type="password"
                    placeholder="Rewrite password"
                    value={formData.password2}
                    onChange={handleInputChange}
                />
                {formErrors.password2 && (
                    <div className="errorText">{formErrors.password2}</div>
                )}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default App;
