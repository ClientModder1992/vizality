const { React, getModuleByDisplayName } = require('vizality/webpack');
const { AsyncComponent } = require('vizality/components');

const Mask = AsyncComponent.from(getModuleByDisplayName('Mask', true));
const CarouselWithSlide = AsyncComponent.from((async () => {
  const CarouselWithSlide = await getModuleByDisplayName('CarouselWithSlide', true);
  return class Carousel extends CarouselWithSlide {
    render () {
      const res = super.render();
      delete res.props.onMouseEnter;
      delete res.props.onMouseLeave;
      if (this.props.items.length < 2) {
        delete res.props.children[1];
      } else {
        const Controller = res.props.children[1].type;
        res.props.children[1].type = class NewController extends Controller {
          componentDidMount () {
            // Shut eslint
          }

          componentWillUnmount () {
            // Shut eslint
          }
        };
      }
      return res;
    }
  };
})());

module.exports = class Preview extends React.Component {
  render () {
    return <>
      <div className='vizality-product-preview'>
        <CarouselWithSlide
          paused
          items={this.props.previews}
          renderItem={(item) => <Mask mask='svg-mask-vertical-fade' width={320} height={174}>
            <img src={item} alt=''/>
          </Mask>}
        />
      </div>
    </>;
  }
};
