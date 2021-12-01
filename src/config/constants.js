import {translate} from '../common/services/translate';

export const TIRANA_CITY_LOCATION = {
    latitude : 41.32754,
    longitude : 19.81869,
    country : 'Albania',
    city : 'Tirana',
    street : 'Sheshi Skenderbej'
};

export const SocialMapScreenStyles = [
    {
        elementType: 'geometry',
        stylers: [
            {
                color: '#f5f5f5',
            },
        ],
    },
    {
        elementType: 'labels.icon',
        stylers: [
            {
                visibility: 'off',
            },
        ],
    },
    {
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#616161',
            },
        ],
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [
            {
                color: '#f5f5f5',
            },
        ],
    },
    {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#bdbdbd',
            },
        ],
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
            {
                color: '#eeeeee',
            },
        ],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#757575',
            },
        ],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
            {
                color: '#e5e5e5',
            },
        ],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9e9e9e',
            },
        ],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
            {
                color: '#ffffff',
            },
        ],
    },
    {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#757575',
            },
        ],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
            {
                color: '#dadada',
            },
        ],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#616161',
            },
        ],
    },
    {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9e9e9e',
            },
        ],
    },
    {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [
            {
                color: '#e5e5e5',
            },
        ],
    },
    {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [
            {
                color: '#eeeeee',
            },
        ],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
            {
                color: '#c9c9c9',
            },
        ],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9e9e9e',
            },
        ],
    },
];

export const SNAPFOOD_CITYS = [
    'Hamburg', 'San Francisco', 'Berlin', 'Las Vegas', 'Quebec City', 'Seville', 'Vancouver', 'Vancouver',
]

export const CHAT_HISTORY = [
    {
        id : 1,
        avatar: 'https://i.pravatar.cc/150?img=7',
        name: 'Jose Jackson',
        time: '2:30 PM',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        unreadCount: 2
    },
    {
        id : 2,
        avatar: 'https://i.pravatar.cc/150?img=56',
        name: 'Mary Ann Miller',
        time: '2:00 PM',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        unreadCount: 2
    },
    {
        id : 3,
        avatar: 'https://i.pravatar.cc/150?img=32',
        name: 'Jerry Stewart',
        time: 'Wednesday',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        unreadCount: 1
    },
    {
        id : 4,
        avatar: 'https://placeimg.com/140/140/any',
        name: 'Test Group',
        permitted : true,
        time: '2:30 PM',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        members  : [
            {
                avatar: 'https://i.pravatar.cc/150?img=13',
                name: 'Alan Matthews',
                time: 'Wednesday',
                lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
                unreadCount: 0
            },
            {
                avatar: 'https://i.pravatar.cc/150?img=33',
                name: 'Amanda Diaz',
                time: 'Tuesday',
                lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
                unreadCount: 0
            },
            {
                avatar: 'https://i.pravatar.cc/150?img=1',
                name: 'Aaron Hoffman',
                time: '10/3/2021',
                lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
                unreadCount: 0
            },
            {
                avatar: 'https://i.pravatar.cc/150?img=67',
                name: 'Aaron Hoffman',
                time: '10/3/2021',
                lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
                unreadCount: 0
            }
        ],
        unreadCount: 0,
        isGroup  : true
    },
    {
        id : 5,
        avatar: 'https://i.pravatar.cc/150?img=13',
        name: 'Alan Matthews',
        time: 'Wednesday',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        unreadCount: 0
    },
    {
        id : 6,
        avatar: 'https://i.pravatar.cc/150?img=33',
        name: 'Amanda Diaz',
        time: 'Tuesday',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        unreadCount: 0
    },
    {
        id : 7,
        avatar: 'https://i.pravatar.cc/150?img=1',
        name: 'Aaron Hoffman',
        time: '10/3/2021',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        unreadCount: 0
    },
    {
        id : 8,
        avatar: 'https://i.pravatar.cc/150?img=67',
        name: 'Aaron Hoffman',
        time: '10/3/2021',
        lastMessage: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eir...',
        unreadCount: 0
    }
];

export const CALL_HISTORY = [
    {
        id : 1,
        avatar: 'https://i.pravatar.cc/150?img=67',
        name: 'Jose Jackson',
        time: '2:30 PM',
        lastCall: 'Incoming',
        missedCount: 3
    },
    {
        id : 2,
        avatar: 'https://i.pravatar.cc/150?img=1',
        name: 'Joan Palmer',
        time: '2:00 PM',
        lastCall: 'Incoming',
        missedCount: 0
    },
    {
        id : 3,
        avatar: 'https://i.pravatar.cc/150?img=33',
        name: 'Jerry Stewart',
        time: 'Wednesday',
        lastCall: 'Incoming',
        missedCount: 1
    },
    {
        id : 4,
        avatar: 'https://i.pravatar.cc/150?img=13',
        name: 'Alan Matthews',
        time: 'Wednesday',
        lastCall: 'Incoming',
        missedCount: 0
    },
    {
        id : 5,
        avatar: 'https://i.pravatar.cc/150?img=32',
        name: 'Amanda Diaz',
        time: 'Tuesday',
        lastCall: 'Outgoing',
        missedCount: 0
    },
    {
        id : 6,
        avatar: 'https://i.pravatar.cc/150?img=56',
        name: 'Aaron Hoffman',
        time: '10/3/2021',
        lastCall: 'Incoming',
        missedCount: 1
    },
    {
        id : 7,
        avatar: 'https://i.pravatar.cc/150?img=7',
        name: 'Aaron Hoffman',
        time: '10/3/2021',
        lastCall: 'Incoming',
        missedCount: 0
    }
];

export const days = [
    {
        day: 1,
        text: translate('vendor_profile_info.monday'),
    },
    {
        day: 2,
        text: translate('vendor_profile_info.tuesday'),
    },
    {
        day: 3,
        text: translate('vendor_profile_info.wednesday'),
    },
    {
        day: 4,
        text: translate('vendor_profile_info.thursday'),
    },
    {
        day: 5,
        text: translate('vendor_profile_info.friday'),
    },
    {
        day: 6,
        text: translate('vendor_profile_info.saturday'),
    },
    {
        day: 7,
        text: translate('vendor_profile_info.sunday'),
    },
];

export const SNAP_FOOD_SUPPORT = 'SNAP_FOOD_SUPPORT';

export const Order_Pending = 0;
export const Order_Reserved = 1;
export const Order_Preparing = 1;
export const Order_Accepted = 1;
export const Order_Outfordelivery = 2;
export const Order_Ready_pickup = 2;
export const Order_Delivered = 3;
export const Order_Pickedup = 3;
export const Order_Cancelled = -1;

export const OrderType_Delivery = 'Delivery';
export const OrderType_Pickup = 'Pickup';
export const OrderType_Reserve = 'Reserve';

export const VSort_Title = 'title';
export const VSort_FastDelivery = 'maximum_delivery_time';
export const VSort_HighRating = 'rating_interval';
export const VSort_Closest = 'distance';
export const VSort_Low2HighPrice = 'delivery_minimum_order_price';
export const VSort_PopularFirst = 'total_ratings';

export const Address_Home = 'Home';
export const Address_Work = 'Work';
export const Address_Custom = 'Custom';

export const Pay_COD = 'Cash On Delivery';
export const Pay_Card = 'Pay With Card';
export const Pay_Paypal = 'Paypal';
export const Pay_Apple = 'Apple Pay';
