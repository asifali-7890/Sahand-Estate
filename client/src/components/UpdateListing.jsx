import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
    const { listingId } = useParams();
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        type: '',
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`/api/listing/get/${listingId}`, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
                setFormData(response.data.listing);
                setIsFetching(false);
            } catch (error) {
                console.error('Error fetching listing:', error.response ? error.response.data : error.message);
                setError('Error fetching listing. Please try again.');
                setIsFetching(false);
            }
        };

        fetchListing();
    }, [listingId, currentUser.token]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.put(`/api/listing/update/${listingId}`, formData, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
            console.log('Listing updated:', response.data);
            navigate(`/profile`); // Redirect to profile page after update
        } catch (error) {
            console.error('Listing update error:', error);
            setError('Error updating listing. Please try again.');
            setLoading(false);
        }
    };

    if (isFetching) {
        return <p>Loading...</p>;
    }

    return (
        <main className='p-3 max-w-2xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Update Listing
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text'
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                        onChange={handleChange}
                        value={formData?.name}
                    />
                    <textarea
                        type='text'
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData?.description}
                    />
                    <input
                        type='text'
                        placeholder='Address'
                        className='border p-3 rounded-lg'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData?.address}
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input
                                type='radio'
                                name='type'
                                id='type'
                                value='sale'
                                onChange={handleChange}
                                checked={formData?.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='radio'
                                name='type'
                                id='type'
                                value='rent'
                                onChange={handleChange}
                                checked={formData?.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData?.parking}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData?.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData?.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bedrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData?.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bathrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData?.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='regularPrice'
                                min='50'
                                max='10000000'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData?.regularPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                {formData?.type === 'rent' && (
                                    <span className='text-xs'>($ / month)</span>
                                )}
                            </div>
                        </div>
                        {formData?.offer && (
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='discountPrice'
                                    min='0'
                                    max='10000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                    onChange={handleChange}
                                    value={formData?.discountPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted price</p>
                                    {formData?.type === 'rent' && (
                                        <span className='text-xs'>($ / month)</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    disabled={loading}
                    className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? 'Updating...' : 'Update listing'}
                </button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </form>
        </main>
    );
};

export default UpdateListing;