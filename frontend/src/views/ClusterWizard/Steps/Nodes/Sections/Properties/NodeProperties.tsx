import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { observer } from "mobx-react-lite";
import { useFormik } from "formik";
import projectStore from "@/store/projectStore";
import uiPropertiesPanelStore from "@/store/uiPropertiesPanelStore";
import { LogError } from "@wails-runtime/runtime";
import { k4p } from "@wails/models";
import { computed } from "mobx";
import { useOnFirstMount } from "@/reactHooks";
import { GetStorage } from "@wails/provisioner/Service";
import { useState } from "react";
import * as Yup from 'yup';
import FormError from "@/components/FormError";

interface NodeFormModel {
    name: string
    vmid: number
    cores: number
    memory: number
    ipAddress: string
    storagePool: string
}

const schema = Yup.object().shape({
    name: Yup.string().required(),
    vmid: Yup.number().min(100).required(),
    cores: Yup.number().min(1).required(),
    memory: Yup.number().positive().required(),
    ipAddress: Yup.string().min(7).required(),
    storagePool: Yup.string().required()
})
const NodeProperties = () => {

    const [storages, setStorages] = useState([] as string[])

    useOnFirstMount(async () => {
        setStorages(await GetStorage())
    })

    const storedNode = computed(() => {
        if (uiPropertiesPanelStore.selectedPropertiesId) {
            return projectStore.findNode(Number(uiPropertiesPanelStore.selectedPropertiesId))
        } else {
            LogError("cannot delete node because selected node is null, this shouldn't happen")
            return null
        }
    })

    const formik = useFormik({
        validationSchema: schema,
        initialValues: {
            vmid: storedNode.get()?.vmid,
            name: storedNode.get()?.name,
            cores: storedNode.get()?.cores,
            memory: storedNode.get()?.memory,
            ipAddress: storedNode.get()?.ipAddress,
            storagePool: storedNode.get()?.storagePool
        } as NodeFormModel,

        onSubmit: (values, formikHelpers) => {
            if (uiPropertiesPanelStore.selectedPropertiesId) {
                projectStore.updateNode(
                    Number(uiPropertiesPanelStore.selectedPropertiesId),
                    {
                        vmid: values.vmid,
                        name: values.name,
                        cores: values.cores,
                        memory: values.memory,
                        ipAddress: values.ipAddress,
                        storagePool: values.storagePool,
                        nodeType: storedNode.get()?.nodeType
                    } as k4p.KubernetesNode)
                formik.resetForm()
                uiPropertiesPanelStore.hidePanel()
            } else {
                LogError("cannot save node because selected node is null, this shouldn't happen")
            }
        }
    })

    const canBeDeleted = () => {
        if (projectStore.findNode(Number(uiPropertiesPanelStore.selectedPropertiesId))?.nodeType==="master") {
            return projectStore.masterNodes.length > 1;
        } else {
            return true;
        }
    }
    const onDelete = () => {
        if (uiPropertiesPanelStore.selectedPropertiesId) {
            const id = uiPropertiesPanelStore.selectedPropertiesId;
            uiPropertiesPanelStore.hidePanel()
            projectStore.deleteNode(Number(id))
        } else {
            LogError("cannot delete node because selected node is null, this shouldn't happen")
        }
    }

    return <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col w-full h-full items-center">
            <div className="grow w-full">
                <div className="text-3xl text-center font-bold mt-5">Node Properties</div>
                <div className="p-10">
                    <div>
                        <div className="text-stone-400 required">VM id</div>
                        <InputNumber name="vmid"
                                     value={formik.values.vmid}
                                     onChange={v=> {
                                         formik.setFieldValue("vmid", v.value, true)
                                     }}
                                     onBlur={formik.handleBlur}
                                     className="w-full p-inputtext-sm" showButtons buttonLayout="horizontal"
                                     incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                     min={100}></InputNumber>
                        <FormError error={formik.errors.vmid} touched={formik.touched.vmid}/>
                    </div>

                    <div className="mt-3">
                        <div className="text-stone-400 required">Node name</div>
                        <InputText name="name"
                                   value={formik.values.name}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   className="w-full p-inputtext-sm"></InputText>
                        <FormError error={formik.errors.name} touched={formik.touched.name}/>
                    </div>

                    <div className="mt-3">
                        <div className="text-stone-400 required">IP address</div>
                        <InputText name="ipAddress"
                                   value={formik.values.ipAddress}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   className="w-full p-inputtext-sm"></InputText>
                        <FormError error={formik.errors.ipAddress} touched={formik.touched.ipAddress}/>
                    </div>

                    <div className="mt-3">
                        <div className="text-stone-400 required">Storage pool</div>
                        <Dropdown name="storagePool"
                                  value={formik.values.storagePool}
                                  onChange={formik.handleChange}
                                  options={storages}
                                  className="w-full"/>
                        <FormError error={formik.errors.storagePool} touched={formik.touched.storagePool}/>
                    </div>

                    <div className="border-t-2 border-stone-800 text-xl mt-10 mb-3">
                        Resources
                    </div>
                    <div className="mt-3">
                        <div className="text-stone-400 required">CPU cores</div>
                        <InputNumber name="cores"
                                     value={formik.values.cores}
                                     onChange={v=> {
                                         formik.setFieldValue("cores", v.value, true)
                                     }}
                                     onBlur={formik.handleBlur}
                                     className="w-full p-inputtext-sm" showButtons
                                     buttonLayout="horizontal"
                                     incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" min={1}>
                        </InputNumber>
                        <FormError error={formik.errors.cores} touched={formik.touched.cores}/>
                    </div>
                    <div className="mt-3">
                        <div className="text-stone-400 required">Memory (MB)</div>
                        <InputNumber name="memory"
                                     value={formik.values.memory}
                                     onChange={v=> {
                                         formik.setFieldValue("memory", v.value, true)
                                     }}
                                     onBlur={formik.handleBlur}
                                     className="w-full p-inputtext-sm" showButtons
                                     buttonLayout="horizontal"
                                     incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" step={1024}
                                     min={0}></InputNumber>
                        <FormError error={formik.errors.memory} touched={formik.touched.memory}/>
                    </div>


                    <div className="mt-10 flex flex-col items-center">
                        <div className="flex justify-center items-center">
                            <div className="mr-5">
                                <Button disabled={!formik.isValid} type="submit" label="SAVE" className="p-button-primary"/>
                            </div>
                            <Button onClick={onDelete}
                                    disabled={!canBeDeleted()}
                                    label="Delete"
                                    className="p-button-raised p-button-danger p-button-text"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
}


export default observer(NodeProperties)