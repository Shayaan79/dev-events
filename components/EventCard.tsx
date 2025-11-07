import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({title, image, slug, location, date, time}: Props) => {
    return (
        <Link href={`/events/${slug}`} id="event-card">
            <Image src={image} alt={title} width={420} height={300} className="poster"/>

            <div className="!flex !flex-row !items-center !gap-2 !flex-nowrap">
                <Image
                    src="/icons/pin.svg"
                    alt="location"
                    width={14}
                    height={14}
                    className="!inline-block !align-middle"
                />
                <p className="!inline-block">{location}</p>
            </div>

            <p className="title">{title}</p>

            <div className="datetime">
                <div>
                    <Image
                        src="/icons/calendar.svg"
                        alt="date"
                        width={14}
                        height={14}
                        className="!inline-block !align-middle"
                    />
                    <p className="!inline-block">{date}</p>
                </div>
                <div>
                    <Image
                        src="/icons/clock.svg"
                        alt="time"
                        width={14}
                        height={14}
                        className="!inline-block !align-middle"
                    />
                    <p className="!inline-block">{time}</p>
                </div>
            </div>
        </Link>
    );
};
export default EventCard;