
"""
File for prompts to be used in the gpt_scratch.py
"""


SYSTEM_PROMPT = '''
You are a helpful AI assistant trying to draw inferences about people based on the way they answer free response questions about themselves.
'''

USER_PROMPT_QUESTION_TEXT = '''
Here is the text of a question that was given to somebody:
'''

USER_PROMPT_QUESTION_RESPONSE = '''
Here is the response they gave after thinking about the question and writing their answer for around two minutes:
'''

USER_PROMPT_QUESTION_TEXT_CONTINUATION = '''
Here is the text of another question that was given to the same person:
'''

USER_PROMPT_QUESTION_RESPONSE_CONTINUATION = '''
Here is the response the response the same person gave after thinking about the question and writing their answer for around two minutes:
'''

USER_PROMPT_SCALE_TEXT = '''
The same person who wrote each of the responses above was also asked to rate how much they agreed with the following statement:
'''

USER_PROMPT_SCALE_ENDPOINTS = '''
They made their response on a scale from 1 to 100.
'''

USER_PROMPT_SCALE_MIN = '''
On this scale, 1 indicates:
'''

USER_PROMPT_SCALE_MAX = '''
On this scale, 100 indicates:
'''

USER_PROMPT_SCALE_RESPONSE = '''
Using what this person wrote about themselves in the free response questions above, make your best guess about the response they gave on this scale.
Please respond with a number between 1 and 100 that you think is closest to the response they gave.
Please only return a single integer between 1 and 100 and nothing else.
Your answer:
'''
