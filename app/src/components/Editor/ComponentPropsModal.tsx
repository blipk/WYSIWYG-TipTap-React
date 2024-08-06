import React, { useState } from "react"
import { ComponentConfig } from "./custom-nodes/CustomNodeGenerator"

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: ( values: Record<string, any> ) => void;
    componentConfig: ComponentConfig;
}

const ComponentPropsModal: React.FC<ModalProps> = ( { isOpen, onClose, onSubmit, componentConfig } ) => {
    const [values, setValues] = useState<Record<string, any>>( {} )

    const fields: { name: string, inputType: string }[] =
        Object.keys( componentConfig.inputProps ).map( ( propName ) => ( { name: propName, inputType: componentConfig.inputProps[propName] } ) )


    const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        setValues( {
            ...values,
            [e.target.name]: e.target.value,
        } )
    }

    if ( !isOpen ) return null

    return (
        <div className={`modal ${isOpen ? "show" : ""}`} style={{ display: isOpen ? "block" : "none" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Insert Component `{componentConfig.name}`</h5>
                        <button type="button" className="modal-close-button" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form
                            onSubmit={( e ) => {
                                e.preventDefault()
                                onSubmit( values )
                                onClose()
                            }}
                        >
                            {fields.map( ( field ) => (
                                <div className="form-group" key={field.name}>
                                    <div className="modal-form-item">
                                        <label>{field.name}</label>
                                        <input
                                            type={field.inputType}
                                            name={field.name}
                                            className="form-control"
                                            value={values[field.name] || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            ) )}
                            <button type="submit" className="btn btn-primary">OK</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComponentPropsModal