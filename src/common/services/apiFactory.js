import axios from 'axios';
import Config from '../../config'; 

const factory = new axios.create({
	timeout: 30000,
	baseURL: Config.BASE_URL,
	headers: { 
		'Content-Type': 'application/json' 
	},
});
 
factory.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			//  
		}
		return Promise.reject(error.response ? error.response.data : error);
	}
);

export default factory;
