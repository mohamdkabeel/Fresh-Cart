export default function FormField({ id, label, type = 'text', formik, name }) {
    const fieldName = name || id;
    const hasError = formik.errors[fieldName] && formik.touched[fieldName];

    return (
        <>
            <div className="z-0 w-full mb-5 mt-5">
                <label className="text-gray-700" htmlFor={id}>{label}</label>
                <input
                    type={type}
                    id={id}
                    name={fieldName}
                    value={formik.values[fieldName]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control mt-1 px-4 mb-2 block py-2.5 w-full text-sm text-dark bg-white rounded border border-gray-200 focus:outline-none focus:shadow-lg"
                    required
                />
            </div>
            {hasError ? (
                <div className="p-4 mb-4 text-sm text-red-900 rounded-lg bg-red-50" role="alert">
                    {formik.errors[fieldName]}
                </div>
            ) : null}
        </>
    );
}
