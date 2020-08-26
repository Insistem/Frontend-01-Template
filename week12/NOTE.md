# 每周总结可以写在这里
// 四则运算符的抽象语法树
MultiplicativeExpressione: [
  {
    "type": "Expression",
    "children": [
      {
        "type": "AdditiveExpression",
        "children": [
          {
            "type": "AdditiveExpression",
            "children": [
              {
                "type": "MultiplicativeExpression",
                "children": {
                  "type": "Number",
                  "value": "99"
                }
              }
            ]
          },
          {
            "type": "+",
            "value": "+"
          },
          {
            "type": "MultiplicativeExpression",
            "children": [
              {
                "type": "MultiplicativeExpression",
                "children": [
                  {
                    "type": "MultiplicativeExpression",
                    "children": {
                      "type": "Number",
                      "value": "1024"
                    }
                  },
                  {
                    "type": "*",
                    "value": "*"
                  },
                  {
                    "type": "Number",
                    "value": "2"
                  }
                ]
              },
              {
                "type": "/",
                "value": "/"
              },
              {
                "type": "Number",
                "value": "3"
              }
            ]
          }
        ]
      },
      {
        "type": "EOF"
      }
    ]
  }
]
字符串分析算法
字典树 Trie
大量字符串的完整模式匹配

KMP
时间复杂度为 O(m + n)

WildCard 通配符算法
长字符串中找子串升级版

正则
状态机
LL LR