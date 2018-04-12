import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Object as ObserveObject } from 'can-observe'
import { connect } from 'react-view-model'
import { Container, Header } from 'semantic-ui-react'
import './<%= name %>.less'

export class ViewModel extends ObserveObject {
  propTypes = {
    message: PropTypes.string,
    heading: PropTypes.string
  }
  heading = 'Hi There!'
  message = 'I am a React Component using react-view-model.'
}

@connect(ViewModel)
export default class CreateSearchComonent extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired
  }
  render () {
    const { heading, message } = this.props
    return (
      <<%= tag %>>
        <Container text>
          <Header as='h1'>{heading}</Header>
          <p>{message}</p>
        </Container>
      </<%= tag %>>
    )
  }
}
