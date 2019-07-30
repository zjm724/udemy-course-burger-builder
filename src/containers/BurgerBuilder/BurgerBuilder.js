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
import * as burgerBuilderActions from '../../store/Actions/Index';


class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
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
        return sum > 0 ;
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
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
                        purchaseable={this.updatePurchaseState(this.props.ings)}
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
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));