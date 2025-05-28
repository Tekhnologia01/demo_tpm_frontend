import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEnquiry: any;
  onSubmit: (values: any, actions: any) => void;
  isSubmitting: boolean;
  editMode: boolean;
}

interface Product {
  product_id: number; // Adjusted to match expected API field
  product_Name: string;
}

interface Package {
  package_id: number; // Adjusted to match expected API field
  package_Name: string;
}

const EnquiryPopup: React.FC<EnquiryPopupProps> = ({
  isOpen,
  onClose,
  selectedEnquiry,
  onSubmit,
  editMode,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);

  // Define initial values for the form
  const initialValues = editMode
    ? {
        Name: selectedEnquiry?.Name || '',
        Institute_Name: selectedEnquiry?.Institute_Name || '',
        Email: selectedEnquiry?.Email || '',
        Contact: selectedEnquiry?.Contact || '',
        Product: selectedEnquiry?.Product_id?.toString() || '', // Use product_id
        Package: selectedEnquiry?.Package_id?.toString() || '', // Use package_id
        Message: selectedEnquiry?.Message || '',
        Enquiry_Status: selectedEnquiry?.Enquiry_Status || 'Pending',
      }
    : {
        Name: '',
        Institute_Name: '',
        Email: '',
        Contact: '',
        Product: '',
        Package: '',
        Message: '',
        Enquiry_Status: 'Pending',
      };

  // Fetch products when the popup is opened
  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
          const response = await axiosInstance.get('/productcategory');
          const productData = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data.data)
            ? response.data.data
            : [];
          setProducts(productData);
        } catch (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
          setProducts([]);
        } finally {
          setIsLoadingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  // Fetch packages when the Product field changes or in edit mode
  const fetchPackages = async (productId: string) => {
    if (!productId) {
      setPackages([]);
      return;
    }
    setIsLoadingPackages(true);
    try { 
      console.log(`Fetching packages for product ID: ${productId}`);
      const response = await axiosInstance.get(`/fetchpackage/${productId}`);
      const packageData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      setPackages(packageData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
      setPackages([]);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  // Fetch packages when selectedEnquiry changes (edit mode)
  useEffect(() => {
    if (isOpen && editMode && selectedEnquiry?.Product_id) {
      fetchPackages(selectedEnquiry.Product_id.toString());
    }
  }, [isOpen, editMode, selectedEnquiry]);

  if (!isOpen) return null;

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
          {editMode ? 'Update Enquiry' : 'Add New Enquiry'}
        </h2>

        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="flex-1 overflow-y-auto">
              <div className="pr-2">
                {!editMode && (
                  <>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Name</label>
                      <Field
                        name="Name"
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Institute Name</label>
                      <Field
                        name="Institute_Name"
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter institute name"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Contact</label>
                      <Field
                        name="Contact"
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Email</label>
                      <Field
                        name="Email"
                        type="email"
                        className="w-full p-2 border rounded"
                        placeholder="Enter email"
                      />
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Product</label>
                  <Field
                    as="select"
                    name="Product"
                    className="w-full p-2 border rounded"
                    onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                      const productId = e.target.value;
                      setFieldValue('Product', productId);
                      setFieldValue('Package', ''); // Reset package when product changes
                      await fetchPackages(productId); // Fetch packages for the selected product
                    }}
                    disabled={isLoadingProducts}
                  >
                    <option value="">Select a product</option>
                    {isLoadingProducts ? (
                      <option value="">Loading products...</option>
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <option key={product.product_id} value={product.product_id}>
                          {product.product_Name}
                        </option>
                      ))
                    ) : (
                      <option value="">No products available</option>
                    )}
                  </Field>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Package</label>
                  <Field
                    as="select"
                    name="Package"
                    className="w-full p-2 border rounded"
                    disabled={isLoadingPackages || packages.length === 0}
                  >
                    <option value="">Select a package</option>
                    {isLoadingPackages ? (
                      <option value="">Loading packages...</option>
                    ) : packages.length > 0 ? (
                      packages.map((pkg) => (
                        <option key={pkg.package_id} value={pkg.package_id}>
                          {pkg.package_Name}
                        </option>
                      ))
                    ) : (
                      <option value="">No packages available</option>
                    )}
                  </Field>
                </div>
                {!editMode && (
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Message</label>
                    <Field
                      name="Message"
                      as="textarea"
                      className="w-full p-2 border rounded"
                      placeholder="Enter message"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Status</label>
                  <Field
                    as="select"
                    name="Enquiry_Status"
                    className="w-full p-2 border rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </Field>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-4 sticky bottom-0 bg-white pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editMode ? 'Update' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EnquiryPopup;