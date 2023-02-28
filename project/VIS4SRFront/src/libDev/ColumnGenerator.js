class ColumnConfig{
    constructor(columnType, title, x, width, height){
        this.columnType = columnType;
        this.title = title;
        this.width = width;
        this.height = height;
        this.x = x
    }
    setProcessFunc(func){
        this.setFunc = func
    }

    setKeyAttributes(attr){
        this.keyAttr = attr
    }

    returnAnalysisContext(slice){
        //Text of distribution
        if(this.columnType == 'text'){
            return this.setFunc(slice)
        }else if (this.columnType == 'distribution'){
            return ['datasetIds', 'metricNames']
        }else if (this.columnType == 'values'){
            return this.setFunc(slice)
        }
    }
}

class ColumnFactory{
    static returnTextColumn(columnType, title, x, width, height, textFunc){
        let conf = new ColumnConfig('text', title, x, width, height)
        conf.setProcessFunc(textFunc)
        return conf
    }

    static returnDisColumn(columnType, title, x, width, height, keyAttr){
        let conf = new ColumnConfig('distribution', title, x, width, height)
        conf.setKeyAttributes(keyAttr)
        return conf
    }

    static returnValuesColumn(columnType, title, x, width, height, attrFunc){
        let conf = new ColumnConfig('values', title, x, width, height)
        conf.setProcessFunc(attrFunc)
        return conf
    }

    static returnText

}

export {ColumnFactory, ColumnConfig}