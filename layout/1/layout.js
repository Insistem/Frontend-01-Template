function layout(element) {
    if (!element.computedStyle) {
        return
    }

    let elementStyle = getStyle(element)
    if (elementStyle.display !== 'flex') {
        return
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase
        if (elementStyle.flexDirection === 'row') {
            mainSize = 'width'
            mainStart = 'left'
            mainEnd = 'right'
            mainSign = +1
            mainBase = 0

            crossSize = 'height'
            crossStart = 'top'
            crossEnd = 'bottom'
        }

        if (elementStyle.flexDirection === 'row-reverse') {
            mainSize = 'width'
            mainStart = 'right'
            mainEnd = 'left'
            mainSign = -1
            mainBase = style.width

            crossSize = 'height'
            crossStart = 'top'
            crossEnd = 'bottom'
        }
        if (style.flexDirection === 'column') {
            mainSize = 'height';
            mainStart = 'top';
            mainEnd = 'bottom';
            mainSign = +1;
            mainBase = 0;
        
            crossSize = 'width';
            crossStart = 'left';
            crossEnd = 'right';
          }

          if (style.flexDirection === 'column-reverse') {
            mainSize = 'height';
            mainStart = 'bottom';
            mainEnd = 'top';
            mainSign = +1;
            mainBase = style.height;
        
            crossSize = 'width';
            crossStart = 'left';
            crossEnd = 'right';
          }
          // 这个属性是改变交叉轴 cross的方向
          if (style.flexWrap === 'wrap-reverse') {
            let tmp = crossStart;
            crossStart = crossEnd;
            crossEnd = tmp;
            crossSign = -1;
          } else {
            crossBase = 0;
            crossSign = 1;
          }

}

module.exports.layout = layout