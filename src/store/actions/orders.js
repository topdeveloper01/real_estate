import apiFactory from '../../common/services/apiFactory'; 
 
export const getPastOrders=(vendor_id)=>{
    return new Promise((resolve, reject) => {  
        apiFactory.get(`orders?vendor_id=${vendor_id}`).then(
            ({ data }) => { 
                resolve(data.orders.data);
            },
            (error) => { 
                reject(error);
            }
        );
    }); 
}

export const changeOrderStatus = (orderId, status) => {
    return new Promise(async (resolve, reject) => {
        apiFactory
          .post('/orders/update_status', {
              order_id: orderId,
              status: status,
          })
          .then(
            (response) => {
                resolve(response);
            },
            (error) => {
                reject(error);
            }
          );
    });
};
 
export const getOrderDetail=(id)=>{
    return new Promise((resolve, reject) => { 
        apiFactory.get(`orders/${id}`).then(
            ({ data }) => { 
                resolve(data.order);
            },
            (error) => { 
                reject(error);
            }
        );
    }); 
}
 
export const getOrders = (
    page = 1, 
    perPage = 15,
    filterKeys, 
    orderBy,
    orderDirection,
  ) => {
      const params = [`page=${page}`, `per_page=${perPage}`];
      if (orderBy) {
          params.push(`ordering_attribute=${orderBy}`);
          params.push(`ordering_order=${orderDirection}`);
      }
  
      if (!!filterKeys && filterKeys.length > 0) {
          for (let i = 0; i < filterKeys.length; i++) {
              params.push(filterKeys[i]); 
          }
      }
   
      return new Promise(async (resolve, reject) => {
          apiFactory.get(`orders?${params.join('&')}`).then(
            ({ data }) => {
                resolve(data.orders);
            },
            (error) => {
                reject(error);
            }
          );
      });
  };
 