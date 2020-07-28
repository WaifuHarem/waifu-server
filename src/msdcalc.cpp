
// Diff Wrapper
// Used for binding Minacalc to javascript.
// v0.0.0
// Not ready for implementation

#include <node.h>

// TODO - #include <minacalc.h>

namespace MinaCalcBindings
{
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::String;
    using v8::Value;

    Local<Object> receive(const FunctionCallbackInfo<Value>& args)
    {
        Isolate* isolate = args.GetIsolate();
        // TODO - Process Input args to data we can send to Mina calc for processing
        // TODO - Format reply from mina calc to js compatible object
    }

    void Init(Local<Object> exports)
    {
        NODE_SET_METHOD(exports, receive);
    }

    NODE_MODULE("minacalc", Init)

};