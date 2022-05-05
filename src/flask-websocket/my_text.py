# coding=utf-8
from aip import AipNlp
from aip import AipContentCensor
import simplejson

""" 你的 APPID AK SK """
APP_ID = '26036365'
API_KEY = 'IAVzKRbmCD7aPFuQoOGcCx2y'
SECRET_KEY = '01d2OIkoVC5Sfvr3UiHQyoLwSnOapstx'

client1 = AipNlp(APP_ID, API_KEY, SECRET_KEY)
client2 = AipContentCensor(APP_ID, API_KEY, SECRET_KEY)


def get_labels(title, content):
    print(title)
    print(content)
    results = client1.keyword(title, content)
    labels = []
    if len(results) != 0:
        for result in results.get('items'):
            labels.append(result.get('tag'))
    return labels


def get_sim(word1, word2):
    return client1.simnet(word1, word2);

# results = get_labels('js解释器', '现在，让我们关注实际执行 JavaScript 代码的这部分流程，即代码被解释和优化的地方，并讨论其在主要的 JavaScript 引擎之间存在的一些差异。 一般来说，（所有 JavaSciript 引擎）都有一个包含解释器和优化编译器的处理流程。其中，解释器可以快速生成未优化的字节码，而优化编译器会需要更长的时间，以便最终生成高度优化的机器码。 这个通用流程几乎与在 Chrome 和 Node.js 中使用的 V8 引擎工作流程一致：V8 中的解释器被称作 Ignition，它负责生成并执行字节码。当它运行字节码时会收集分析数据，而它之后可以被用于加快（代码）执行的速度。当一个函数变得 hot，例如它经常被调用，生成的字节码和分析数据则会被传给 TurboFan——我们的优化编译器，它会依据分析数据生成高度优化的机器码。 SpiderMonkey，在 Firefox 和 SpiderNode 中使用的 Mozilla 的 JavaScript 引擎，则有一些不同的地方。它们有两个优化编译器。解释器将代码解释给 Baseline 编译器，该编译器可以生成部分优化的代码。 结合运行代码时收集的分析数据，IonMonkey 编译器可以生成高度优化的代码。 如果尝试优化失败，IonMonkey 将回退到 Baseline 阶段的代码。 Chakra，用于 Edge 和 Node-ChakraCore 两个项目的微软 JavaScript 引擎，也有类似两个优化编译器的设置。解释器将代码优化成 SimpleJIT——其中 JIT 代表 Just-In-Time 编译器——它可以生成部分优化的代码。 结合分析数据，FullJIT 可以生成更深入优化的代码。 JavaScriptCore（缩写为JSC），Apple 的 JavaScript 引擎，被用于 Safari 和 React Native 两个项目中，它通过三种不同的优化编译器使效果达到极致。低级解释器 LLInt将代码解释后传递给 Baseline 编译器，而（经过 Baseline 编译器）优化后的代码便传给了 DFG 编译器，（在 DFG 编译器处理后）结果最终传给了 FTL 编译器进行处理。 为什么有些引擎会拥有更多的优化编译器呢？这完全是一些折衷的取舍。解释器可以快速生成字节码，但字节码通常不够高效。另一方面，优化编译器处理需要更长的时间，但最终会生成更高效的机器码。到底是快速获取可执行的代码（解释器），还是花费更多时间但最终以最佳性能运行代码（优化编译器），这其中包含一个平衡点。一些引 擎选择添加具有不同耗时/效率特性的多个优化编译器，以更高的复杂性为代价来对这些折衷点进行更细粒度的控制。我们刚刚强调了每个 JavaScript 引擎中解释器和优化编译器流程中的主要区别。除了这些差异之外，所有 JavaScript 引擎都有相同的架构：那就是拥有一个解析器和某种解 释器/编译器流程。')
# print(results)
# results = get_sim('js解释器', 'js编译器')
# print(results)

# word1 = "javascript解释器"
#
# word2 = "js解释器"
#
# """ 调用词义相似度 """
# print(client1.simnet(word1, word2))
# print(client2.textCensorUserDefined("测试文本"))
