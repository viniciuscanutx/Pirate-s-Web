import Image from "next/image";

const ParentalRating = ({ rating }) => {
  if (rating == null) {
    return null; 
  }

  const getRatingImage = (rating) => {
    const ratingString = String(rating).toLowerCase();
    switch (ratingString) {
      case 'l':
        return '/ratings/L.png';
      case '10':
        return '/ratings/10.png';
      case '12':
        return '/ratings/12.png';
      case '14':
        return '/ratings/14.png';
      case '16':
        return '/ratings/16.png';
      case '18':
        return '/ratings/18.png';
      default:
        return '/ratings/L.png';
    }
  };

  return (
    <div className="absolute p-2 top-0 left-0 z-20">
      <Image
        src={getRatingImage(rating)}
        width={40}
        height={40}
        alt={`Classificação indicativa: ${rating}`}
      />
    </div>
  );
};

export default ParentalRating;

