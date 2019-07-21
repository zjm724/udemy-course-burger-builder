import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/BuildControls/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actionTypes from '../../store/Action';


class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: null,
    }

    componentDidMount() {
        // console.log(this.props);
        // axios.get('https://react-my-burger-1a064.firebaseio.com/ingredients.json').then(response => {
        //     this.setState({ ingredients: response.data });
        // }).catch((error) => {
        //     this.setState({error: true});
        // });
    }

    updatePurchaseState(updatedIngredients) {
        const sum = Object.keys(updatedIngredients).map(igKey => {
            return updatedIngredients[igKey]
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({ purchaseable: sum > 0 });
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // alert('Continued.');

        const queryParams = [];
        for (let i in this.props.ings) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]));
        }
        queryParams.push('price=' + this.props.price);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString,
        });
    }

    render() {
        let orderSummary = null;
        let burger = this.state.error ? <p>ingredients can't be loaded.</p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={this.props.ings}
                        purchaseable={this.state.purchaseable}
                        price={this.props.price}
                        ordered={this.purchaseHandler} />
                </Aux>
            );

            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                totalPrice={this.props.price.toFixed(2)}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        };

        if (this.state.loading) {
            orderSummary = <Spinner />;
        };

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));