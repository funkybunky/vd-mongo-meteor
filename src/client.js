'use strict'

import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data'

import NodesContainer from 'VD/client/components/nodes/nodes.container.client.js'

ReactDOM.render(<NodesContainer raster={raster} />, document.getElementById('root'))
