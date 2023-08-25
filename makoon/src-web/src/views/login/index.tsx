import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {LoginRequest} from "@/api/model";
import LogoContainer from "@/components/LogoContainer";
import {InputText} from "primereact/inputtext";
import FormError from "@/components/FormError";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {FormikHelpers} from "formik/dist/types";
import api from "@/api/api";
import applicationStore from "@/store/application-store";

type FormValues = {
    host: string
    username: string
    password: string
}

const schema = Yup.object().shape({
    host: Yup.string().required(),
    username: Yup.string().required(),
    password: Yup.string().required()
});

const initialValues: FormValues = {host: "", username: "", password: ""}

const Login = () => {
    const [loginError, setLoginError] = useState(false)
    const navigate = useNavigate()

    const formik = useFormik<FormValues>({
        validateOnMount: true,
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: async (values: FormValues, formikHelpers: FormikHelpers<any>) => {
            const status = await api.auth.login({
                host: values.host,
                port: 8006,
                username: values.username,
                password: values.password
            } as LoginRequest);

            if (status >= 200 && status <= 299) {
                setLoginError(false)
                formikHelpers.setSubmitting(false);
                navigate("/list")
                return
            }
            if (status == 401) {
                setLoginError(true)
                formikHelpers.setSubmitting(false);
                return
            }
            applicationStore.throwError("Unknown error: " + status)
            formikHelpers.setSubmitting(false);
        }
    })
    return <LogoContainer>
        <form onSubmit={formik.handleSubmit} className="flex flex-col items-center">
            <div className="w-full max-w-[400px]">
                <div className="text-lg">Proxmox host:</div>
                <div className="flex items-center">
                    <InputText name="host"
                               autoFocus
                               disabled={formik.isSubmitting}
                               value={formik.values.host}
                               onChange={formik.handleChange}
                               onBlur={formik.handleBlur}
                               className="w-[330px]"
                               placeholder="192.168.1.10"></InputText>
                    <div className="ml-1">:8006</div>
                </div>
                <FormError error={formik.errors.host} touched={formik.touched.host}/>
            </div>

            <div className="mt-4 w-full max-w-[400px]">
                <div className="text-lg">Proxmox username:</div>
                <div className="flex items-center">
                    <InputText
                        name="username"
                        disabled={formik.isSubmitting}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-[330px]" placeholder="root"></InputText>
                    <div className="ml-1">@pam</div>
                </div>
                {/*<div className="text-sm italic text-stone-400">*/}
                {/*    Hint: For security reasons, Makoon should have dedicated user in Proxmox to be able manage only own VM's.*/}
                {/*</div>*/}
                <FormError error={formik.errors.username} touched={formik.touched.username}/>
            </div>

            <div className="mt-1 w-full max-w-[400px]">
                <div className="text-lg">Proxmox password:</div>
                <Password
                    name="password"
                    disabled={formik.isSubmitting}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    feedback={false}
                    toggleMask={true}
                    className="w-full" inputClassName="w-full">
                </Password>
                <FormError error={formik.errors.password} touched={formik.touched.password}/>

            </div>

            {
                loginError &&
                <div className="mt-6 font-bold p-error">
                    Cannot login to Proxmox
                </div>
            }

            <div className="mt-2">
                <Button type="submit" disabled={!formik.isValid}>
                    {formik.isSubmitting && <i className="pi pi-spin pi-spinner text-base mr-2"></i>}
                    Login to Proxmox
                </Button>
            </div>
        </form>
        <div className="mt-8 -mb-6 text-surface-500 text-center">
            Copyright &copy; 2022-2023 Damian Sieradzki
        </div>
    </LogoContainer>
}

export default Login;