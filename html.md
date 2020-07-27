# input number
    使用原生input type=number时，虽然可以直接唤起数字键盘，但是仍然可以切换英文/中文输入，但是输入的时候却不会触发onchange事件，仅在input框中出现，导致最终验证也做不了
    解决办法：
        在input标签中添加 pattern="[0-9]*"
        或者onkeyup="this.value=this.value.replace(/[^\d]/,'')"


    因ios 讯飞输入法 数字键盘会有数学符号, 但是如果设置type="number" 无法触发change事件
        所以设置
            type="text"
            onChange={ (e) => { e.target.value.replace(/[^\d]/, '')} }