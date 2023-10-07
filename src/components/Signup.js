import React, { useState } from "react";
import { Alert, Card, Form, InputGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [alert, setAlert] = useState(null);

    const [validated, setValidated] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);

        if (username !== '' && password !== '' && confirmPassword !== '') {
            
            if (password !== confirmPassword) {
                setAlert({ variant: 'danger', message: 'Passwords do not match. Please try again.' });
                return;
            }

            try {
                await axios.post(
                    '/api/users',
                    {
                        nickname: username,
                        password: password
                    },
                    {}
                );
                // setUser(response.data)
                navigate('/', {state: { alert: {variant: "success", message: "You have successfully signed up. Welcome aboard!"}}})
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setAlert({ variant: 'danger', message: 'Username already exists. Please choose another one.' });
                } else {
                    setAlert({ variant: 'danger', message: 'Failed to register. Please try again later.' });
                }
            } finally {
                setUsername('')
                setPassword('')
                setConfirmPassword('')
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "30rem" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-3">Sign Up</Card.Title>

                    {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>{alert.message}</Alert>}

                    <Form noValidate validated={validated} onSubmit={handleSignUp}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="text"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please choose a username.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a password.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm password</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please confirm password.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text id="passwordHelpBlock" muted>
                                    Your password must be 8-20 characters long, contain letters and numbers,
                                    and must not contain spaces, special characters, or emoji.
                                </Form.Text>
                        </Form.Group>

                        <div className="d-grid gap-2 mb-3">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                        <Form.Text>Already have an account? <Link to='/'>Sign In</Link></Form.Text>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default SignUp;
