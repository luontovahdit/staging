// @flow

import type { Layer } from 'leaflet'
import React, { Fragment } from 'react'

import { LeafletProvider } from './context'
import MapComponent from './MapComponent'
import type { LeafletContext, MapLayerProps } from './types'
import { connect } from 'react-redux'

//MapLayer wraps the leaflet Layer, which is parent to EsriFeatureLayer / L.esri.FeatureLayer
class MapLayer<
  LeafletElement: Layer,
  Props: MapLayerProps,
> extends MapComponent<LeafletElement, Props> {
  contextValue: ?LeafletContext

  constructor(props: Props) {
    super(props)
    this.leafletElement = this.createLeafletElement(props)
  }

  get layerContainer(): Layer {
    return this.props.leaflet.layerContainer || this.props.leaflet.map
  }

  createLeafletElement(_props: Props): LeafletElement {
    throw new Error('createLeafletElement() must be implemented')
  }

  updateLeafletElement(_fromProps: Props, _toProps: Props) {}

  componentDidMount() {
    //why call parents mount?
    super.componentDidMount()
    //this.leafletElement holds the GTK featureLayer with set options
    this.layerContainer.addLayer(this.leafletElement)
  }

  componentDidUpdate(prevProps: Props) {
    super.componentDidUpdate(prevProps)

    if (this.props.attribution !== prevProps.attribution) {
      const { map } = this.props.leaflet
      if (map != null && map.attributionControl != null) {
        map.attributionControl.removeAttribution(prevProps.attribution)
        map.attributionControl.addAttribution(this.props.attribution)
      }
    }

    this.updateLeafletElement(prevProps, this.props)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.layerContainer.removeLayer(this.leafletElement)
  }
  //Runs on loading app/map. interaction not necessary
  render() {
    const { children } = this.props
    if (children == null) {
      return null
    }
    return this.contextValue == null ? (
      <Fragment>{children}</Fragment>
    ) : (
      <LeafletProvider value={this.contextValue}>{children}</LeafletProvider>
    )
  }
}
export default MapLayer;
