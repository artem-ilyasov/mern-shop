import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from '../components/Message'
import { getOrderDetails } from '../actions/orderActions'
import { Loader } from '../components/Loader'

export const OrderScreen = ({ match }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const { order = {}, error, loading } = useSelector(state => state.orderDetails);

  const { 
    shippingAddress: { address, postalCode, city, country } = {},
    orderItems,
    paymentMethod,
    shippingPrice,
    taxPrice,
    totalPrice
  } = order;

  const addDecimals = number => (Math.round(number * 100) / 100).toFixed(2);

  let itemsPrice;

  if (!loading) {
    itemsPrice = addDecimals(orderItems.reduce((acc, { price, quantity }) => (
      acc + price * quantity
    ), 0));
  }


  useEffect(() => {
    dispatch(getOrderDetails(orderId))
  }, [dispatch, orderId]);

  if (loading || error) {
    return loading ? <Loader /> : <Message variant='danger'>{error}</Message>
  }
  
  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {` ${address}, ${city}, ${postalCode}, ${country}`}
              </p>
              {order.isDelivered
                ? <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                : <Message variant='danger'>Not delivered</Message>
              }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {paymentMethod}
              </p>
              {order.isPaid
                ? <Message variant='success'>Paid on {order.paidAt}</Message>
                : <Message variant='danger'>Not Paid</Message>
              }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {orderItems.length === 0
                ? <Message>Order is empty</Message>
                : <ListGroup variant='flush'>
                    {orderItems.map(({ product, image, name, quantity, price }) => (
                      <ListGroup.Item key={product}>
                        <Row>
                          <Col md={1}>
                            <Image src={image} alt={name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${product}`}>
                              {name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {`${quantity} x ${price} = ${addDecimals(quantity * price)}`}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
              }
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

OrderScreen.propTypes = {

}