import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart, actionLabel = 'Add to Cart', children }) {
    return (
        <div className="product p-4 rounded-lg">
            <Link to={`/Productdetails/${product.id}/${product.category.name}`}>
                <img className="w-full" src={product.imageCover} alt={product.name} />
                <h2>{product.name}</h2>
                <p>{product.category.name}</p>
                <p className="text-xl font-normal text-gray-800 mb-4">
                    {product.title.split(' ').splice(0, 2).join(' ')}
                </p>
                <div className="flex justify-between items-center">
                    <p>{product.price} EGP</p>
                    <p>
                        {product.ratingsAverage}{' '}
                        <i className="fas fa-star text-yellow-500"></i>
                    </p>
                </div>
            </Link>
            {children}
            {onAddToCart && (
                <button
                    onClick={() => onAddToCart(product.id)}
                    className="btn px-4 py-2 w-full rounded-lg text-white bg-green-600"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
