if(process.env.NODE_ENV === 'development') {
  require('./template.html')
}
import './style.css';

import './22.scss';

if (module['hot']) {
  module['hot'].accept();
}