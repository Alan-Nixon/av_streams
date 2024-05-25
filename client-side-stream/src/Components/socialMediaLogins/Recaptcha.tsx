import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RecaptchaSecret, captchaPropsInterface } from "../../Functions/interfaces";

// mui imports
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const Recaptcha = ({ showCaptcha, validate }: captchaPropsInterface) => {
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState("")



    const verifiedFunction = () => {
        if (isVerified) {
            validate(true)
        } else {
            alert("please select")
        }
    }

    return (<>
        <div>

            <Dialog
                open={true}
                onClose={() => showCaptcha(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">

                <DialogTitle id="alert-dialog-title">{"Lets Verify You Are Human"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="">
                            <p className="error">{error}</p>
                            <ReCAPTCHA
                                sitekey={RecaptchaSecret || ""}
                                onChange={(token: any) => setIsVerified(token ? true : false)}
                            />
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => showCaptcha(false)}>Disagree</Button>
                    <Button onClick={verifiedFunction} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>
        </div >
    </>)
};

export default Recaptcha;



