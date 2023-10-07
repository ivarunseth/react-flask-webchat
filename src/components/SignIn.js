import React, { useContext, useState, useEffect } from "react";
import { Alert, Card, Form, InputGroup, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

const SignIn = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { setUser } = useContext(UserContext)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [alert, setAlert] = useState(null);

    const [validated, setValidated] = useState(false);

    useEffect(() => {
        // Check for alert in location state and display it if available
        if (location.state && location.state.alert) {
            // Display alert message, you can set it in your component state
            setAlert(location.state.alert)
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);

        if (username !== '' && password !== '') {
            try {
                const response = await axios.post(
                    '/api/tokens',
                    {},
                    {
                        auth: {
                            username: username,
                            password: password
                        }
                    }
                );
                setUser(response.data)
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/chat");
            } catch (error) {   
                setAlert({ variant: 'danger', message: 'Invalid username or password.' });
                console.error(error)
            } finally {
                setUsername('')
                setPassword('')
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "30rem" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-3">Sign In</Card.Title>

                    {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>{alert.message}</Alert>}

                    <Form noValidate validated={validated} onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a username.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter password.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <div className="d-grid gap-2 mb-3">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                        <Form.Text>Don't have an account? <Link to='/signup'>Sign Up</Link></Form.Text>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default SignIn;
