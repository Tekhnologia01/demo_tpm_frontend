// ClientPopup.tsx

import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

interface ClientPopupProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  mode: 'add' | 'edit';
  onSubmit: (values: any) => void;
  products: Array<{ product: number; product_Name: string }>;
  plan: Array<{ plan: number; plan_Name: string }>;
  loading: boolean;
  error: string | null;
}

interface FormValues {
  user_Name: string;
  institute_Name: string;
  contact: string;
  email: string;
  product: string;
  plan: string;
  start_Date: string;
}

const validationSchema = Yup.object().shape({
  user_Name: Yup.string().required('Client Name is required'),
  institute_Name: Yup.string().required('Institute Name is required'),
  contact: Yup.string().required('Contact is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  product: Yup.string().required('Product is required'),
  plan: Yup.string().required('Plan is required'),
  start_Date: Yup.date().required('Start Date is required'),
});

const ClientPopup: React.FC<ClientPopupProps> = ({
  isOpen,
  onClose,
  client,
  mode,
  onSubmit,
  products,
  plan,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  const initialValues: FormValues = mode === 'add' ? {
    user_Name: '',
    institute_Name: '',
    contact: '',
    email: '',
    product: '',
    plan: '',
    start_Date: '',
  } : {
    user_Name: client?.User_Name || '',
    institute_Name: client?.Institute_Name || '',
    contact: client?.Contact || '',
    email: client?.Email || '',
    product: client?.product?.toString() || '', // Ensure string type for dropdown
    plan: client?.plan?.toString() || '',       // Ensure string type for dropdown
    start_Date: client?.Start_Date ? new Date(client.Start_Date).toISOString().slice(0, 10) : '',
  };

  console.log('Initial values:', initialValues); // Debug initial values
  console.log('Products:', products); // Debug products array
  console.log('Plans:', plan); // Debug plans array

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md h-[70vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {mode === 'add' ? 'Add New Client' : 'Edit Client'}
        </h2>

        {loading && <p>Loading dropdown data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <Formik<FormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Submitted values:", values); // Debug submitted values
            onSubmit(values);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex-1 overflow-y-auto">
              <div className="pr-2">
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Client Name</label>
                  <Field
                    name="user_Name"
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter client name"
                  />
                  {touched.user_Name && errors.user_Name && (
                    <p className="text-red-500 text-sm mt-1">{errors.user_Name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Institute Name</label>
                  <Field
                    name="institute_Name"
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter institute name"
                  />
                  {touched.institute_Name && errors.institute_Name && (
                    <p className="text-red-500 text-sm mt-1">{errors.institute_Name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Contact</label>
                  <Field
                    name="contact"
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter contact number"
                  />
                  {touched.contact && errors.contact && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full p-2 border rounded"
                    placeholder="Enter email"
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Product</label>
                  <Field
                    as="select"
                    name="product"
                    className="w-full p-2 border rounded"
                    disabled={loading || products.length === 0}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.product} value={product.product.toString()}>
                        {product.product_Name}
                      </option>
                    ))}
                  </Field>
                  {touched.product && errors.product && (
                    <p className="text-red-500 text-sm mt-1">{errors.product}</p>
                  )}
                  {products.length === 0 && !loading && !error && (
                    <p className="text-red-500 text-sm mt-1">No products available</p>
                  )}
                  
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Plan</label>
                  <Field
                    as="select"
                    name="plan"
                    className="w-full p-2 border rounded"
                    disabled={loading || plan.length === 0}
                  >
                    <option value="">Select a plan</option>
                    {plan.map((pkg) => (
                      <option key={pkg.plan} value={pkg.plan.toString()}>
                        {pkg.plan_Name}
                      </option>
                    ))}
                  </Field>
                  {touched.plan && errors.plan && (
                    <p className="text-red-500 text-sm mt-1">{errors.plan}</p>
                  )}
                  {plan.length === 0 && !loading && !error && (
                    <p className="text-red-500 text-sm mt-1">No plans available</p>
                  )}
                  
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Start Date</label>
                  <Field
                    name="start_Date"
                    type="date"
                    className="w-full p-2 border rounded"
                  />
                  {touched.start_Date && errors.start_Date && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_Date}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-white pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ClientPopup;