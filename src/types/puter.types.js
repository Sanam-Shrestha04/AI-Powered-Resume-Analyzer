/**
 * @typedef {Object} FSItem
 * @property {string} id
 * @property {string} uid
 * @property {string} name
 * @property {string} path
 * @property {boolean} is_dir
 * @property {string} parent_id
 * @property {string} parent_uid
 * @property {number} created
 * @property {number} modified
 * @property {number} accessed
 * @property {number|null} size
 * @property {boolean} writable
 */

/**
 * @typedef {Object} PuterUser
 * @property {string} uuid
 * @property {string} username
 */

/**
 * @typedef {Object} KVItem
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {"file" | "text"} ChatMessageContentType
 */

/**
 * @typedef {Object} ChatMessageContent
 * @property {ChatMessageContentType} type
 * @property {string} [puter_path]
 * @property {string} [text]
 */

/**
 * @typedef {"user" | "assistant" | "system"} ChatRole
 */

/**
 * @typedef {Object} ChatMessage
 * @property {ChatRole} role
 * @property {string | ChatMessageContent[]} content
 */

/**
 * @typedef {Object} PuterChatOptions
 * @property {string} [model]
 * @property {boolean} [stream]
 * @property {number} [max_tokens]
 * @property {number} [temperature]
 * @property {Object} [tools]
 * @property {"function"} tools.type
 * @property {Array<Object>} tools.function
 * @property {string} tools.function[].name
 * @property {string} tools.function[].description
 * @property {Object} tools.function[].parameters
 * @property {string} tools.function[].parameters.type
 * @property {Object} tools.function[].parameters.properties
 */

/**
 * @typedef {Object} AIResponse
 * @property {number} index
 * @property {Object} message
 * @property {string} message.role
 * @property {string | any[]} message.content
 * @property {string|null} message.refusal
 * @property {any[]} message.annotations
 * @property {any|null} logprobs
 * @property {string} finish_reason
 * @property {Array<Object>} usage
 * @property {string} usage[].type
 * @property {string} usage[].model
 * @property {number} usage[].amount
 * @property {number} usage[].cost
 * @property {boolean} via_ai_chat_service
 */