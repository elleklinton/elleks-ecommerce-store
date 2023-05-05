import ProductBadge from './productBadge';
import ProductRating from './productRating'
import ProductGallery from './productGallery'
import ProductSizes from './productSizes'

interface Props {
  title: string;
  subscription?: boolean;
  color: string;
  images: ({
    src: string;
    alt: string;
  })[];
  full_description: string;
  price: number;
  highlights: string[];
  details: string;
  rating: number;
  reviews: number;
  features: string[]
}

export default function ProductOverview({
  title,
    subscription,
  images,
  full_description,
  price,
  highlights,
  details,
  rating,
  reviews,
    features
}: Props) {
  const formattedPrice = parseFloat((price ?? 0).toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2 }) + (subscription ? '/month' : '')

  // @ts-ignore
  return (
    <>
    <div className="card card-product card-plain">
      {(images.length != 0) &&
      <ProductGallery images={images}/>
      }
      <div className="row mt-5">
        <div className="col-12 col-lg-8 border-end">
          {(title.length != 0) &&
            <h2>{title}</h2>
          }
          {(full_description.length != 0) &&
            <p>{full_description}</p>
          }
          {(details.length != 0) &&
              <>
                <h6>Details</h6>
                <p>{details}</p>
              </>
          }
          {(highlights.length != 0) &&
              <>
                <h6>Highlights</h6>
                <ul className="text-sm">
                  {highlights.map(highlight =>
                      <li className="mb-2">{highlight}</li>
                  )}
                </ul>
              </>
          }
          {(features.length != 0) &&
              <>
                <h6>Features</h6>
                <ul className="text-sm">
                  {features.map(feature =>
                      <li className="mb-2">{feature}</li>
                  )}
                </ul>
              </>
          }


        </div>
        <div className="col-12 col-lg-4 ps-4">
          <form action="" method="post">
            <div className="d-flex">
              <h3 className="font-weight-normal">${formattedPrice}</h3>
              <input className="opacity-0" defaultValue={price} />
            </div>
            {(rating != 0) &&
            <>
              <h3 className="sr-only">Reviews</h3>
              <ProductRating rating={rating} reviews={reviews} />
            </>
            }
            <br/>
            <div id={"applepay_container"}></div>
            {/*<button className="btn btn-primary btn-lg w-100" type="submit">Add to cart</button>*/}
          </form>
        </div>
      </div>
    </div>
    </>
  );
};
